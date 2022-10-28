
data class Action(
    @SerializedName("actionType")
    var actionType: String? = null,
    @SerializedName("manipulations")
    var manipulations: MutableList<Manipulation> = ArrayList(),
) {
    fun getActionType(): ActionType {
        return ActionType.init(actionType)
    }
}

enum class ActionType(val value: String) {
    LOGIN("LOGIN"),
    TRANSFER("TRANSFER"),
    CHECK_BALANCE("CHECK_BALANCE"),
    CHECK_TRANSACTION("CHECK_TRANSACTION"),
    GET_HISTORY("GET_HISTORY"),
    RELOAD_HISTORY("RELOAD_HISTORY"); // scroll down to get more until saved transaction

    companion object {
        fun init(value: String?): ActionType {
            return when (value) {
                LOGIN.value -> LOGIN
                TRANSFER.value -> TRANSFER
                CHECK_BALANCE.value -> CHECK_BALANCE
                GET_HISTORY.value -> GET_HISTORY
                CHECK_TRANSACTION.value -> CHECK_TRANSACTION
                else -> RELOAD_HISTORY
            }
        }
    }
}

data class Manipulation(
    @SerializedName("manipulationType")
    var manipulationType: String? = null,
    @SerializedName("infos")
    var infos: MutableList<ManipulationInfo> = ArrayList(),
    @SerializedName("delay")
    var delay: Int? = 1000,
    @SerializedName("isAwait")
    var isAwait: Boolean? = null,
    @SerializedName("scrollDirection")
    var scrollDirection: String? = null,
    @SerializedName("fillTextType")
    var fillTextType: String? = null
) {
    fun getManipulationType(): ManipulationType {
        return ManipulationType.init(manipulationType)
    }

    fun getFillTextType(): FillTextType {
        return FillTextType.init(fillTextType)
    }
}

enum class FillTextType(val value: String) {
    BANK_ACCOUNT("BANK_ACCOUNT"),
    PASSWORD("PASSWORD"),
    MONEY("MONEY"),
    CONTENT("CONTENT"),
    BANK_NAME("BANK_NAME"),
    LOGIN_PASSWORD("LOGIN_PASSWORD"),
    LOGIN_ACCOUNT("LOGIN_ACCOUNT"),
    OTP("OTP"),
    PASSWORD_OTP("PASSWORD_OTP");

    companion object {
        fun init(value: String?) : FillTextType {
            return when (value) {
                BANK_ACCOUNT.value -> BANK_ACCOUNT
                PASSWORD.value -> PASSWORD
                MONEY.value -> MONEY
                CONTENT.value -> CONTENT
                BANK_NAME.value -> BANK_NAME
                LOGIN_PASSWORD.value -> LOGIN_PASSWORD
                LOGIN_ACCOUNT.value -> LOGIN_ACCOUNT
                OTP.value -> OTP
                else -> PASSWORD_OTP
            }
        }
    }
}
enum class ManipulationType(val value: String) {
    TOUCH("TOUCH"),
    SCROLL("SCROLL"),
    FILL_TEXT("FILL_TEXT"),
    GET_INFO("GET_INFO"),
    CHECK_NOTIFICATION("CHECK_NOTIFICATION");

    companion object {
        fun init(value: String?) : ManipulationType {
            return when (value) {
                TOUCH.value -> TOUCH
                SCROLL.value -> SCROLL
                FILL_TEXT.value -> FILL_TEXT
                GET_INFO.value -> GET_INFO
                else -> CHECK_NOTIFICATION
            }
        }
    }
}

enum class ScrollDirection(val value: String) {
    UP("UP"),
    DOWN("DOWN"),
    LEFT("LEFT"),
    RIGHT("RIGHT");

    fun init(value: String?): ScrollDirection {
        return when (value) {
            UP.value -> UP
            DOWN.value -> DOWN
            LEFT.value -> LEFT
            RIGHT.value -> RIGHT
            else -> {
                throw IllegalArgumentException("wrong scroll direction type")
            }
        }
    }
}

data class ManipulationInfo(
    @SerializedName("text")
    var text: String? = null,
    @SerializedName("viewId")
    var viewId: String? = null,
    @SerializedName("hint")
    var hint: String? = null,
    @SerializedName("bounds")
    var bounds: String? = null,
    @SerializedName("description")
    var description: String? = null,
    @SerializedName("pattern")
    var pattern: String? = null,
    @SerializedName("transactionFieldIndex")
    var transactionFieldIndex: String? = null,
    @SerializedName("parentNode")
    var parentCount: String? = null,
    @SerializedName("childIndexes")
    var childIndexes: String? = null
) {
    fun getBound() : Bound? {
        val list = bounds?.split(",") ?: return null
        return Bound(list[0].toFloat(), list[1].toFloat(), list[2].toFloat(), list[3].toFloat())
    }
    fun getRect() : Rect {
        val list = bounds?.split(",") ?: return Rect(0,0,0,0)
        return Rect(list[0].toInt() ?: 0, list[1].toInt() ?: 0, list[2].toInt() ?: 0, list[3].toInt() ?: 0)
    }
    fun getTransactionFieldIndex(): Int? {
        return transactionFieldIndex?.toInt()
    }
    fun getParentCount(): Int? {
        return parentCount?.toInt()
    }
    fun getChildIndexes(): MutableList<Int> {
        return childIndexes?.split(",")?.map { it.toInt() } as MutableList<Int>? ?: ArrayList()
    }
    fun isMatch(node: AccessibilityNodeInfo?): Boolean {
        val textMatch = if (text.isNullOrEmpty()) true else text == node?.text?.toString()
        val viewIdMatch =
            if (viewId.isNullOrEmpty()) true else viewId == node?.viewIdResourceName?.toString()
        val hintMatch = if (hint.isNullOrEmpty()) true else hint == node?.hintText?.toString()
        val descriptionMatch = if (description.isNullOrEmpty()) {
            true
        } else {
            description == node?.contentDescription?.toString()
        }
        return textMatch && viewIdMatch && hintMatch && descriptionMatch
    }
}

data class Bound(
    @SerializedName("left")
    var left: Float? = null,
    @SerializedName("top")
    var top: Float? = null,
    @SerializedName("right")
    var right: Float? = null,
    @SerializedName("bottom")
    var bottom: Float? = null
) {
    val centerHorizontal : Float
        get() {
        return ((left ?: 0f) + (right ?: 0f)) / 2f
    }
    val centerVertical : Float
        get() {
        return ((top ?: 0f) + (bottom ?: 0f)) / 2f
    }
}